CREATE TABLE `tokens` (
  `id` BIGINT NOT NULL,
  `token` TEXT NOT NULL,
  `headers` MEDIUMTEXT NOT NULL,
  `body` MEDIUMTEXT NOT NULL,
  `issued` DATETIME NOT NULL,
  `isTrustworthy` BOOLEAN NOT NULL,
  `ip` TEXT
);

CREATE TABLE `requests` (
  `id` BIGINT NOT NULL,
  `token_id` BIGINT NOT NULL,
  `headers` MEDIUMTEXT NOT NULL,
  `date` DATETIME NOT NULL,
  `ip` TEXT,
  `url` TEXT,
  `query_string` TEXT
);