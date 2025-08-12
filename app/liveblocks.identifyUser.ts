const { body, status } = await liveblocks.identifyUser({
  userId: "olivier@example.com",
});

// '{ token: "eyJga7..." }'
console.log(body);
