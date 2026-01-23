export type Cupon = {
    cupon_id: number;
    cedula_reclamante: string;
    fecha_reclamo: EpochTimeStamp;
    convenio_id: number;
    codigo_cupon: string;
}