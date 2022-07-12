using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dotnet_react.Migrations
{
    public partial class UpdateGameItem : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ObjectID",
                table: "GameItems",
                type: "TEXT",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ObjectID",
                table: "GameItems");
        }
    }
}
