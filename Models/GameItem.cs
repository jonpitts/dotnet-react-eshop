namespace GameListApi.Models
{
    public class GameItem
    {
        public long Id { get; set; }
        public string? Name { get; set; }
        public bool InCollection { get; set; }
        public string? ObjectID { get; set; }
    }
}