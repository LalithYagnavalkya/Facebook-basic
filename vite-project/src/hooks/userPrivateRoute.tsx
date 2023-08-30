import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../services/types";
import { apiPrivate } from "../services/api";

const useAxiosPrivate = () => {
  const { token: accessToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const requestIntercept = apiPrivate.interceptors.request.use(
      (config) => {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = apiPrivate.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const prevRequest = error?.config;
        // if (error?.response?.status === 403 && !prevRequest?.sent) {
        //   prevRequest.sent = true;
        //   const newAccessToken = await refresh();
        //   prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        //   return apiPrivate(prevRequest);
        // }
        return Promise.reject(error);
      }
    );

    return () => {
      apiPrivate.interceptors.request.eject(requestIntercept);
      apiPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken]);

  return apiPrivate;
};

export default useAxiosPrivate;
