import Redis from "ioredis";

const redis = new Redis(
  "redis://:sARf8oPnrDLn6n8c6jTOSWKSKjArPmfzTAzCaLxFSqw=@vchackathon.redis.cache.windows.net:6379"
);

export default redis;
