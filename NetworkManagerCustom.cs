using Mirror;
using UnityEngine;

public class NetworkManagerCustom : NetworkManager
{
    public override void OnServerAddPlayer(NetworkConnectionToClient conn)
    {
        GameObject player = Instantiate(playerPrefab);
        NetworkServer.AddPlayerForConnection(conn, player);
        // Assign roles/teams or handle co-op setup here
    }
}