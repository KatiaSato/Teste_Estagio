using Microsoft.AspNetCore.Mvc;
using TesteEstagio.Data;
using TesteEstagio.Models;
using TesteEstagio.Services;

namespace TesteEstagio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PessoaController : ControllerBase
    {
        private readonly PessoaService _service = new();
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_service.Listar());
        }

        [HttpPost]
        public IActionResult Post(Pessoa pessoa)
        {
            Pessoa novaPessoa = _service.Adicionar(pessoa);
            return Created("", novaPessoa);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _service.Excluir(id);
            return NoContent();
        }
    }
}
