using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GameListApi.Models;

namespace dotnet_react.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameItemsController : ControllerBase
    {
        private readonly GameListContext _context;

        public GameItemsController(GameListContext context)
        {
            _context = context;
        }

        // GET: api/GameItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GameItem>>> GetGameItems()
        {
            if (_context.GameItems == null)
            {
                return NotFound();
            }

            var gameItems = await _context.GameItems.ToListAsync();
            return gameItems;
        }

        // GET: api/GameItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GameItem>> GetGameItem(long id)
        {
            if (_context.GameItems == null)
            {
                return NotFound();
            }
            var gameItem = await _context.GameItems.FindAsync(id);

            if (gameItem == null)
            {
                return NotFound();
            }

            return gameItem;
        }

        // PUT: api/GameItems/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGameItem(long id, GameItem gameItem)
        {
            if (id != gameItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(gameItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GameItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/GameItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<GameItem>> PostGameItem(GameItem gameItem)
        {
            if (_context.GameItems == null)
            {
                return Problem("Entity set 'GameListContext.GameItems' is null.");
            }
            _context.GameItems.Add(gameItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetGameItem), new { id = gameItem.Id }, gameItem);
        }

        // DELETE: api/GameItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGameItem(long id)
        {
            if (_context.GameItems == null)
            {
                return NotFound();
            }
            var gameItem = await _context.GameItems.FindAsync(id);
            if (gameItem == null)
            {
                return NotFound();
            }

            _context.GameItems.Remove(gameItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GameItemExists(long id)
        {
            return (_context.GameItems?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
