CREATE TABLE `tokens` (
  `id` BIGINT NOT NULL,
  `token` TEXT NOT NULL,
  `headers` MEDIUMTEXT NOT NULL,
  `body` MEDIUMTEXT NOT NULL,
  `issued` DATE NOT NULL,
  `isTrustworthy` BOOLEAN NOT NULL
);

CREATE TABLE `requests` (
  `token_id` BIGINT NOT NULL,
  `headers` MEDIUMTEXT NOT NULL,
  `body` MEDIUMTEXT,
  `date` DATE NOT NULL,
  `user_agent` MEDIUMTEXT NOT NULL
);