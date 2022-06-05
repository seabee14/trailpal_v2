import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserCredentialsSpec = Joi.object()
  .keys({
    email: Joi.string().email().example("homer@simpson.com").required(),
    password: Joi.string().example("secret").required(),
  })
  .label("UserCredentials");

  export const UserSpec = UserCredentialsSpec.keys({
    // begin with uppercase then 2+ lowercase letters for sanitisation
    firstName: Joi.string().example("Homer").regex(/^[A-Z][a-z]{2,}$/),
    lastName: Joi.string().example("Simpson").regex(/^[A-Z][a-z]{2,}$/),
  }).label("UserDetails");

  export const UserSpecPlus = UserSpec.keys({
    _id: IdSpec,
    __v: Joi.number(),
  }).label("UserDetailsPlus");

export const UserArray = Joi.array().items(UserSpecPlus).label("UserArray");


export const TrailSpec = Joi.object()
  .keys({
    title: Joi.string().required().example("Mount Errigal"),
    county: Joi.string().required().example("Donegal"),
    long: Joi.number().allow("").optional().example(12),
    latt: Joi.number().allow("").optional().example(12),
    traillistid: IdSpec,
  })
  .label("Trail");

export const TrailSpecPlus = TrailSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("TrailPlus");

export const TrailArraySpec = Joi.array().items(TrailSpecPlus).label("TrailArray");


export const TraillistSpec = Joi.object()
  .keys({
    title: Joi.string().required().example("Ulster Trails"),
    userid: IdSpec,
    trails: TrailArraySpec,
  })
  .label("Traillist");

export const TraillistSpecPlus = TraillistSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("TraillistPlus");

export const TraillistArraySpec = Joi.array().items(TraillistSpecPlus).label("TraillistArray");