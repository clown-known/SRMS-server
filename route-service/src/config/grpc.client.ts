import { ClientOptions, Transport } from "@nestjs/microservices";

const grpcOptions : ClientOptions = {
    transport: Transport.GRPC,
        options: {
            package: 'permission',
            protoPath: './src/proto/permission.proto',
            url: '127.0.0.1:5000',
        },
}
export default grpcOptions