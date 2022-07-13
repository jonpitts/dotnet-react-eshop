import axios from "axios";
import { env } from "process";
import { useEffect, useMemo, useState } from "react";
import { Grid, GridItem, Badge, Text } from "@chakra-ui/react";
import { getQueriedGamesAmerica, QueriedGameUS } from "nintendo-switch-eshop";

import InfiniteScroll from "react-infinite-scroller";

const apiUrl = env.ASPNETCORE_HTTPS_PORT
  ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
  : env.ASPNETCORE_URLS
  ? env.ASPNETCORE_URLS.split(";")[0]
  : "https://localhost:7138";

interface Game extends QueriedGameUS {
  savedGameId?: number;
}

const PAGE_SIZE = 20;

const GameList = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [page, setPage] = useState(0);
  const [loadMore, setLoadMore] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadGames = async (page = 0) => {
    // setIsLoading(true);
    const queriedGames = (await getQueriedGamesAmerica("", {
      hitsPerPage: PAGE_SIZE,
      page,
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
    queriedGames.length >= PAGE_SIZE ? setHasMore(true) : setHasMore(false);

    setGames(games.concat(queriedGames));
    // setIsLoading(false);
  };

  useEffect(() => {
    if (loadMore) {
      console.log(loadMore, "loadMore", page, "page");
      setHasMore(false);
      setLoadMore(false);
      (async () => {
        await loadGames(page);
      })();
      setPage(page + 1);
    }
  }, [loadMore]);

  const handleAdd = async (game: Game) => {
    const result = await axios({
      method: "POST",
      url: `${apiUrl}/api/GameItems`,
      data: { Name: game.title, ObjectID: game.objectID },
    });
    game.savedGameId = result.data.id;
    setGames([...games]);
  };

  const handleDelete = async (game: Game) => {
    if (!game.savedGameId) return;
    await axios({
      method: "DELETE",
      url: `${apiUrl}/api/GameItems/${game.savedGameId}`,
    });
    game.savedGameId = undefined;
    setGames([...games]);
  };

  return (
    <div>
      <h1>Games</h1>
      <InfiniteScroll
        pageStart={0}
        loadMore={() => {
          setLoadMore(true);
        }}
        hasMore={hasMore}
        loader={
          <div className="loader" key={0}>
            Loading ...
          </div>
        }
      >
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
                key={game.objectID}
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
      </InfiniteScroll>
      {hasMore ? "hasMore" : "noMore"}
    </div>
  );
};

export default GameList;
