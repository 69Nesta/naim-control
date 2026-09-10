build:
	cargo build --workspace --bin naim-web
	cp target/debug/naim-web .
	./naim-web

clean:
	rm -f naim-web

run:
	./naim-web

test:
	cargo test --workspace

