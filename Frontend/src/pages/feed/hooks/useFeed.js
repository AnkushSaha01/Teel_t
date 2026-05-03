
import { useContext } from "react";
import { GlobalContext } from "../../../context/Context";
import { fetchFeed } from "../services/feed.api";

export const useFeed = () => {
    const { setData, backURI } = useContext(GlobalContext);

    const fetchData = async () => {
      const res = await fetchFeed(backURI);

      setData(res);
      console.log(res);
    };
    
 return {fetchData}
}

