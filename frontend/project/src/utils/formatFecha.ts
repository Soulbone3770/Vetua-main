   // "2015-05-13T05:00:00.000Z" -> "13/05/2015"
   export const formatFecha = (fecha: unknown): string => {
       if (!fecha) return "—";
       const [y, m, d] = String(fecha).slice(0, 10).split("-");
       return y && m && d ? `${d}/${m}/${y}` : String(fecha);
   };