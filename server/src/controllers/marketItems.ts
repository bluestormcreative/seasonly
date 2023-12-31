import { RequestHandler } from "express";
import createHttpError from "http-errors";
import {
  MONGODB_DATABASE,
  MONGODB_COLLECTION,
  mongoClient,
} from "../util/dbClient";
import MarketItemModel from "../models/marketItems";

// Get all market items.
export const getMarketItems: RequestHandler = async (req, res, next) => {
  try {
    const marketItems = await MarketItemModel.find().exec();
    res.status(200).json(marketItems);
  } catch (error) {
    next(error);
  }
};

// Get single market item
export const getMarketItem: RequestHandler = async (req, res, next) => {
  const marketItemName = req.params.name;
  try {
    const marketItem = await MarketItemModel.findOne({
      name: marketItemName,
    }).exec();
    if (!marketItem) {
      throw createHttpError(404, "Item not found");
    }
    res.status(200).json(marketItem);
  } catch (error) {
    next(error);
  }
};

// Get all market items of type
export const getMarketItemTypes: RequestHandler = async (req, res, next) => {
  const itemTypeName = req.params.typeName;

  try {
    const marketItems = await MarketItemModel.find({
      itemType: itemTypeName,
    }).exec();
    if (!marketItems) {
      throw createHttpError(404, "Item type not found");
    }
    res.status(200).json(marketItems);
  } catch (error) {
    next(error);
  }
};

// Get all seleceted market items
export const getSelectedMarketItems: RequestHandler = async (
  req,
  res,
  next
) => {
  const itemNames = req.query.items?.toString();
  const selectedItems = itemNames?.split(",");
  try {
    const selectedMarketItems = await MarketItemModel.find({
      name: { $in: selectedItems },
    }).exec();
    if (!selectedMarketItems) {
      throw createHttpError(404, "Selected items not found");
    }
    res.status(200).json(selectedMarketItems);
  } catch (error) {
    next(error);
  }
};

// Get all in-season market items for the selected zone.
export const getSeasonalMarketItems: RequestHandler = async (
  req,
  res,
  next
) => {
  const zone = req.params.zone;
  const month = req.params.month;
  const monthFormatted = month.charAt(0).toUpperCase() + month.slice(1);
  const zoneDigit = zone.replace(/[^0-9]/g, "");

  const db = mongoClient.db(MONGODB_DATABASE);
  const collection = db.collection(MONGODB_COLLECTION);

  const pipeline = [];

  // Create the aggregate pipeline (MQL).
  pipeline.push(
    {
      $unwind: {
        path: "$zones",
      },
    },
    {
      $match: {
        "zones.zone": zoneDigit,
      },
    },
    {
      $unwind: {
        path: "$zones.dates.harvest",
      },
    },
    {
      $match: {
        "zones.dates.harvest": monthFormatted,
      },
    }
  );

  // Only return the fields we need.
  pipeline.push({
    $project: {
      _id: 1,
      itemType: 1,
      displayName: 1,
      name: 1,
      imageUrl: 1,
    },
  });

  try {
    const result = await collection.aggregate(pipeline);
    const marketItems = await result.toArray();
    if (marketItems.length === 0) {
      throw createHttpError(404, "No in-season items found");
    }
    res.status(200).json(marketItems);
  } catch (error) {
    next(error);
  }
};
