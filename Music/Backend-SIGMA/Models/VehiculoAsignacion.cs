using System.ComponentModel.DataAnnotations;

namespace Backend_SIGMA.Models
{
    public class VehiculoAsignacion
    {
        [Key]
        public int IdAsignacion { get; set; }

        public int IdVehiculo { get; set; }
        public Vehiculo Vehiculo { get; set; }

        public int IdUsuario { get; set; }
        public Usuario Usuario { get; set; }

        public DateTime FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }

        public bool Activo { get; set; } = true;
    }
}
