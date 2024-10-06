export default {
  official:
    /(?:^|\b)discord(?:(?:app)?\.com\/invite|\.gg(?:\/invite)?)\/(?<code>[\w-]{2,255})(?:$|\b)/gi,

  sources: [
    {
      location: "discordservers.com",
      redirect: "https://discordservers.com/server",
      regexp:
        /(?:^|\b)discordservers\.com\/server\/(?<vanity>[\w-]{2,225})(?:$|\b)/gi,
    },
    {
      location: "disc.gg",
      redirect: "https://disc.gg/",
      regexp: /(?:^|\b)disc\.gg\/(?<vanity>[\w-]{2,225})(?:$|\b)/gi,
    },
    {
      location: "disboard.org",
      redirect: "https://disboard.org/server/join/",
      regexp:
        /(?:^|\b)disboard\.org\/server\/join\/(?<id>[\d-]{18,22})(?:$|\b)/gi,
    },
    {
      location: "discadia.com",
      redirect: "https://discadia.com/",
      regexp: /(?:^|\b)discadia\.com\/(?<vanity>[\w-]{2,225})(?:$|\b)/gi,
    },
    {
      location: "discords.com",
      redirect: "https://discords.com/servers/",
      regexp:
        /(?:^|\b)discords\.com\/servers\/(?<vanity>[\w-]{2,225})(?:$|\b)/gi,
    },
    {
      location: "discordfy.com",
      redirect: "https://discordfy.com/",
      regexp: /(?:^|\b)discordfy\.com\/(?<vanity>[\w-]{2,225})(?:$|\b)/gi,
    },
  ],
};
