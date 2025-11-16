declare global
  interface Liveblocks {
    UserMeta: {
      id: string;

      // Example, use any JSON-compatible data in your metadata
      info: {
        name: string;
        avatar: string;
        colors: string[];
      }
    }

    // Other type definitions
    // ...
  }
}
