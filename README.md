# Naim Control Web Interface

## Responsive design

The app is responsive across phones, iPads, and desktop screens.

It also supports PWA installation. On iPhone, open the app in Safari, tap the
Share button, choose **Add to Home Screen**, and confirm.

| iPhone | iPad |
| --- | --- |
| ![iPhone preview](./assets/preview_iphone.png) | ![iPad preview](./assets/preview_ipad.png) |

## Installation

Clone the repository and build the frontend and backend:

```sh
git clone --recursive -j8 git@github.com:69Nesta/naim-control.git
cd naim-control
make build
```

### Docker

Build and run the app with:

```sh
make run
# or
docker compose up --build
```

The web interface is available at http://localhost:3000.

To configure the container with environment variables, copy the example file
and edit the values for your setup:

```sh
cp .env.example .env
$EDITOR .env
```

`.env.example` contains all available `APP__` settings, including
`APP__DEVICE_IP`, `APP__PORT`, `APP__BIND_ADDR`, and `APP__STATIC_DIR`. Values
in `.env` override the matching settings in `server/config.toml`. Recreate the
container after changing `.env`:

```sh
docker compose up --build --force-recreate
```

The development Compose setup also reads `.env` for the backend.

### Docker development

Run the frontend and backend with hot refresh:

```sh
make dev
# or
docker compose -f docker-compose.dev.yml up --build
```

Open http://localhost:5173. Vite reloads frontend changes, and `cargo-watch`
rebuilds and restarts the backend when Rust sources change.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing
Contributions are welcome! Create a pull request or open an issue to discuss your ideas.

## Author
- [@69Nesta](https://github.com/69Nesta)