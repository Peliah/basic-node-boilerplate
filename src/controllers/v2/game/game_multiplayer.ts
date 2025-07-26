import { Request, Response } from 'express';
import Game, { GameStatus } from '@/models/game';
import User from '@/models/user';
import { logger } from '@/lib/winston';

export enum EventType {
  GAME_CREATED = 'gameCreated',
  GAME_STARTED = 'gameStarted',
  GAME_FINISHED = 'gameFinished',
  JOIN_GAME = 'joinGameRoom',
  PLAYER_FORFEIT = 'playerForfeit',
}

const createGame = async (req: Request, res: Response) => {
  try {
    const { bet, timeout } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.balance < bet) return res.status(400).json({ error: 'Insufficient balance' });

    user.balance -= bet; // Block bet
    await user.save();

    const game = await Game.create({
      creator: userId,
      bet,
      timeout,
      status: 'pending',
    });

    // Emit socket event for game creation
    req.io?.emit(EventType.GAME_CREATED, game);
    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const joinGame = async (req: Request, res: Response) => {
  try {
    const game = await Game.findById(req.params.id);
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!game || game.status !== 'pending')
      return res.status(400).json({ error: 'Game not available' });

    if (!user || user.balance < game.bet)
      return res.status(400).json({ error: 'Insufficient balance' });

    user.balance -= game.bet;
    await user.save();

    game.joiner = userId;
    game.status = GameStatus.ACTIVE;
    game.turn = 1;
    await game.save();

    // Emit game started event
    req.io?.to(game.id).emit(EventType.GAME_STARTED, game);
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const playTurn = async (req: Request, res: Response) => {
  try {
    const game = await Game.findById(req.params.id);
    const userId = req.userId;
    const { generatedNumber } = req.body;
    if (!game || game.status !== 'active') return res.status(400).json({ error: 'Game not active' });

    const isCreator = String(game.creator) === String(userId);
    const isJoiner = String(game.joiner) === String(userId);

    if (game.turn === 1 && !isCreator) return res.status(403).json({ error: 'Not your turn' });
    if (game.turn === 2 && !isJoiner) return res.status(403).json({ error: 'Not your turn' });

    if (game.turn === 1) {
      game.creatorNumber = generatedNumber;
      game.turn = 2;
      await game.save();
      return res.json({ generatedNumber, game });
    } else {
      game.joinerNumber = generatedNumber;
      game.status = GameStatus.FINISHED;

      // Determine winner
      let winner = null;
      if (game.creatorNumber! > game.joinerNumber!) winner = game.creator;
      else if (game.creatorNumber! < game.joinerNumber!) winner = game.joiner;

      game.winner = winner;

      // Settle bets
      if (winner) {
        await User.updateOne({ _id: winner }, { $inc: { balance: game.bet * 2 } });
      } else {
        // Draw
        await User.updateOne({ _id: game.creator }, { $inc: { balance: game.bet } });
        await User.updateOne({ _id: game.joiner }, { $inc: { balance: game.bet } });
      }

      await game.save();
      req.io?.to(game.id).emit(EventType.GAME_FINISHED, game);
      return res.json({ generatedNumber, game });
    }
  } catch (error) {
    logger.error('Error during playTurn', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getGameHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const games = await Game.find({
      $or: [
        { creator: userId },
        { joiner: userId }
      ]
    })
      .populate('creator', 'username')
      .populate('joiner', 'username')
      .sort({ createdAt: -1 });

    res.json(games);
  } catch (error) {
    logger.error('Error during getGameHistory', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getAllGames = async (req: Request, res: Response) => {
  try {
    // Optional status filter from query
    const { status } = req.query;
    const filter: any = {};
    if (status && ['pending', 'active', 'finished'].includes(String(status))) {
      filter.status = status;
    }

    const games = await Game.find(filter)
      .populate('creator', 'username')
      .populate('joiner', 'username')
      .sort({ createdAt: -1 });

    res.json(games);
  } catch (error) {
    logger.error('Error during getAllGames', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const forfeitGame = async (socket: any, gameId: string, io: any) => {
  try {
    // Optionally, you may want to check socket.user for auth (see note below)
    const game = await Game.findById(gameId);
    if (!game || game.status !== 'active') return;

    // Who is forfeiting?
    const userId = socket.user?._id;

    // Determine the winner: the OTHER player wins
    let winner = null;
    if (String(game.creator) === String(userId)) {
      winner = game.joiner;
    } else if (String(game.joiner) === String(userId)) {
      winner = game.creator;
    } else {
      // If user is not in game, ignore
      return;
    }

    // Settle the game
    game.status = GameStatus.FINISHED;
    game.winner = winner;
    await game.save();

    // Award bet to winner emit game finished event
    await User.updateOne({ _id: winner }, { $inc: { balance: game.bet * 2 } });
    io.to(gameId).emit(EventType.GAME_FINISHED, { game, forfeit: userId });
  } catch (err) {
    console.error('Forfeit error:', err);
  }
}

export { createGame, getAllGames, joinGame, playTurn, getGameHistory, forfeitGame };