// eslint-disable-next-line no-unused-vars
const typedefs = require('../@typedef/typedefs');

const Create = require('../models/creature.model');

/**
 * @param {typedefs.Creature} creature
 * @returns {Promise<typedefs.Creature>}
 */
exports.createPost = async (creature) => {
  const payload = {
    name: creature.name,
    species: creature.species,
    skinColor: creature.skinColor,
    eyeColor: creature.eyeColor,
    image: creature.image,
    description: creature.description,
    owner: creature.owner,
  };

  const newCreature = await new Create(payload);

  await newCreature.save();

  return newCreature;
};

/**
 * @returns {Promise<typedefs.Creature[]>}
 */
exports.getAllPosts = async () => {
  return await Create.find().lean();
};

/**
 * @param {string} id
 * @returns {Promise<typedefs.Creature>}
 */
exports.getPostById = async (id) => {
  return await Create.findById(id)
    .populate({
      path: 'owner',
      select: '-password ',
    })
    .lean();
};

/**
 * @param {string} id
 * @returns {Promise<typedefs.Creature>}
 */
exports.getMyPosts = async (id) => {
  return await Create.find({ owner: id })
    .populate({
      path: 'owner',
      select: '-password',
    })
    .lean();
};

/**
 * @param {string} id
 * @returns {Promise<void>}
 */

exports.deletePostById = async (id) => {
  await Create.findByIdAndDelete(id);
};

/**
 * @param {string} id
 * @param {typedefs.Creature} creature
 * @returns {Promise<typedefs.Creature>}
 */
exports.updatePostById = async (id, creature) => {
  const payload = {
    name: creature.name,
    species: creature.species,
    skinColor: creature.skinColor,
    eyeColor: creature.eyeColor,
    image: creature.image,
    description: creature.description,
    votes: creature.votes || [],
  };

  const updatedCreature = await Create.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return updatedCreature;
};
