const User = require("../model/userModel");
const NosaSet = require("../model/setModel");
const BlogsAndNews = require("../model/newsAndBlogModel");
const { StatusCodes } = require("http-status-codes");

const getStats = async (req, res, next) => {
  try {
    const totalMembers = await User.countDocuments({ isVerified: true });
    const totalSets = await NosaSet.countDocuments();
    const TotalBlogsAndNews = await BlogsAndNews.countDocuments({
      category: { $in: ["news", "blog"] },
    });
    const events = await BlogsAndNews.countDocuments({ category: "event" });
    res.status(StatusCodes.OK).json({ totalMembers, totalSets, TotalBlogsAndNews, events });
  } catch (error) {
    next(error);
  }
};

module.exports = getStats;
