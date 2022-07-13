import { useEffect, useMemo, useState } from "react";
import { Grid, GridItem, Badge, Text } from "@chakra-ui/react";
import { getQueriedGamesAmerica, QueriedGameUS } from "nintendo-switch-eshop";
import axios from "axios";
import { env } from "process";

const apiUrl = env.ASPNETCORE_HTTPS_PORT
  ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
  : env.ASPNETCORE_URLS
  ? env.ASPNETCORE_URLS.split(";")[0]
  : "https://localhost:7138";

interface Game extends QueriedGameUS {
  savedGameId?: number;
}

const GameList = () => {
  const [games, setGames] = useState<Game[]>([]);

  const loadGames = async () => {
    const queriedGames = (await getQueriedGamesAmerica("", {
      hitsPerPage: 100,
      page: 0,
    })) as Game[];
    const savedGamesResponse = await axios(`${apiUrl}/api/GameItems`);
    // map favorites to games list
    savedGamesResponse.data.forEach((savedGame: any) => {
      // find game in gameslist
      const game = queriedGames.find((g) => {
        return g.objectID === savedGame.objectID;
      });
      if (game) {
        game.savedGameId = savedGame.id;
      }
    });
    setGames(queriedGames);
  };

  useMemo(() => {
    (async () => {
      await loadGames();
    })();
  }, []);

  const handleAdd = async (game: Game) => {
    await axios({
      method: "POST",
      url: `${apiUrl}/api/GameItems`,
      data: { Name: game.title, ObjectID: game.objectID },
    });
    await loadGames();
  };

  const handleDelete = async (game: Game) => {
    if (!game.savedGameId) return;
    await axios({
      method: "DELETE",
      url: `${apiUrl}/api/GameItems/${game.savedGameId}`,
    });
    await loadGames();
  };

  return (
    <div>
      <h1>Games</h1>
      <Grid templateColumns="repeat(3, 1fr)" gap={20}>
        {games &&
          games.map((game) => (
            <GridItem
              w="100%"
              h="200"
              // bg="blue.500"
              onClick={() =>
                game.savedGameId ? handleDelete(game) : handleAdd(game)
              }
            >
              <div>
                <Text>
                  {game.title}
                  {!!game.savedGameId && (
                    <Badge ml="1" fontSize="0.8em" colorScheme="green">
                      Saved
                    </Badge>
                  )}
                </Text>
              </div>
              <div
                style={{
                  backgroundImage: `url(${
                    game.horizontalHeaderImage || game.boxart
                  })`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  // backgroundAttachment: "fixed",
                  height: 200,
                  width: "auto",
                }}
              ></div>
            </GridItem>
          ))}
      </Grid>
    </div>
  );
};

export default GameList;
