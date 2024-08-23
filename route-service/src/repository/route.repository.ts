import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Route } from "src/entity/route";
import { Repository } from "typeorm";

@Injectable()
export class RouteRepository extends Repository<Route> {
    constructor(
        @InjectRepository(Route)
        private readonly routeRepository: Repository<Route>,
    ) {
        super(routeRepository.target, routeRepository.manager, routeRepository.queryRunner);
    }
}