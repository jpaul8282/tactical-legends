// Get the current user from your database
const user = __getUserFromDB__(request);

// Start an auth session inside your endpoint
const session = liveblocks.prepareSession(
  user.id,
  {
    userInfo: {
      name: user.name,
      avatar: user.avatarUrl,
      colors: user.colorArray,
    }
  }
);
