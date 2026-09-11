FROM node:22-bookworm-slim AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

FROM rust:1-bookworm AS server-builder

WORKDIR /app

COPY Cargo.toml Cargo.lock ./
COPY naim-client/Cargo.toml naim-client/Cargo.toml
COPY server/Cargo.toml server/Cargo.toml
COPY naim-client/ naim-client/
COPY server/ server/

RUN cargo build --release --bin server

FROM debian:bookworm-slim AS runtime

WORKDIR /app/server

COPY --from=server-builder /app/target/release/server /usr/local/bin/naim-web
COPY server/config.toml ./config.toml
COPY --from=frontend-builder /app/frontend/dist ../frontend/dist

EXPOSE 3000

CMD ["/usr/local/bin/naim-web"]