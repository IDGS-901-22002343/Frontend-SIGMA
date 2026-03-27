using System.ComponentModel.DataAnnotations;

namespace Backend_SIGMA.Models.Request
{
    public class VehiculoCambiarEstatusRequest
    {
        [Required]
        [RegularExpression("Activo|En mantenimiento|Inactivo", 
            ErrorMessage = "El estatus debe ser 'Activo', 'En mantenimiento' o 'Inactivo'")]
        public string Estatus { get; set; } = string.Empty;
    }
}