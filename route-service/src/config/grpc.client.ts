import { ClientOptions, Transport } from "@nestjs/microservices";

const grpcOptions : ClientOptions = {
    transport: Transport.GRPC,
        options: {
            package: 'permission',
            protoPath: './src/proto/permission.proto',
            url: 'authentication-service:7000',
        },
}
export default grpcOptions