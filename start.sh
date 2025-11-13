#!/bin/sh
PORT=${PORT:-10000}
vite preview --host 0.0.0.0 --port $PORT
