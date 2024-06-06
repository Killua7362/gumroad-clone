import { createFileRoute, notFound, rootRouteId } from "@tanstack/react-router";

export const Route = createFileRoute('/_protected/_layout/products/')({
    loader:()=>{
        throw notFound({routeId:rootRouteId})
    },
})