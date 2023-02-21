import logging
import asyncio
# the official grpc package is named grpcio
import grpc

import config
from pb import compress_pb2_grpc, classify_pb2_grpc
from controller import compressor, classifier


# Coroutines to be invoked when the event loop is shutting down.
_cleanup_coroutines = []

# set grpc options, increase max size to 100MB
options = [
    ('grpc.max_send_message_length', 100 * 1024 * 1024),
    ('grpc.max_receive_message_length', 100 * 1024 * 1024)
]


async def serve() -> None:
    server = grpc.aio.server(options=options)
    compress_pb2_grpc.add_ImageCompressServiceServicer_to_server(compressor.Compressor(), server)
    classify_pb2_grpc.add_ClassificationServiceServicer_to_server(classifier.Classifier(), server)
    listen_addr = config.listen_addr
    server.add_insecure_port(listen_addr)
    logging.info("Starting server on %s", listen_addr)
    await server.start()

    async def server_graceful_shutdown():
        logging.info("Shutting down server")
        # Shuts down the server with 5 seconds of grace period. During the
        # grace period, the server won't accept new connections and allow
        # existing RPCs to continue within the grace period.
        await server.stop(5)

    _cleanup_coroutines.append(server_graceful_shutdown())
    await server.wait_for_termination()


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    loop = asyncio.new_event_loop()
    try:
        loop.run_until_complete(serve())
    finally:
        loop.run_until_complete(*_cleanup_coroutines)
        loop.close()
