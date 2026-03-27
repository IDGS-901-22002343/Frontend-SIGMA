
using System.ComponentModel.DataAnnotations;

namespace Backend_SIGMA.Models
{
    public class EstatusSiniestro
    {
        [Key]
        public int IdEstatus { get; set; }

        [Required, MaxLength(50)]
        public string Nombre { get; set; }
        public ICollection<Siniestro> Siniestros { get; set; }
    }
}