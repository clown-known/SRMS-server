import { ClientOptions, Transport } from "@nestjs/microservices";

const grpcOptions : ClientOptions = {
    transport: Transport.GRPC,
        options: {
            package: 'permission',
            protoPath: './src/proto/permission.proto',
            url: 'grpc-server:7000',
        },
}
export default grpcOptions