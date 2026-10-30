   const ETIQUETAS: Record<string, string> = {
       recepcionista: "Recepcionista",
       veterinario: "Veterinario",
       adminClinica: "Admin clínica",
       adminSistema: "Admin sistema",
   };

   export const etiquetaRol = (rol: string): string => ETIQUETAS[rol] ?? "Usuario";

   export const rutaInicio = (rol: string): string => {
       if (rol === "veterinario") return "/veterinarioPage";
       if (rol === "adminClinica") return "/adminClinicaPage";
       return "/recepcionistaPage";
   };