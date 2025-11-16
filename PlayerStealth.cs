using UnityEngine;

public class PlayerStealth : MonoBehaviour
{
    public float CurrentStealth = 1.0f; // 0 = invisible, 1 = fully visible

    void Update()
    {
        // Example: Reduce stealth when sprinting or firing
        if (Input.GetKey(KeyCode.LeftShift)) // Sprint
            CurrentStealth = Mathf.Min(CurrentStealth + 0.4f * Time.deltaTime, 1f);
        else
            CurrentStealth = Mathf.Max(CurrentStealth - 0.2f * Time.deltaTime, 0.2f);

        if (IsInShadow())
            CurrentStealth *= 0.7f;
    }

    bool IsInShadow()
    {
        // Raycast up and check if hit sky; crude shadow detection
        RaycastHit hit;
        if (Physics.Raycast(transform.position, Vector3.up, out hit))
            return hit.collider != null && hit.collider.gameObject.CompareTag("Cover");
        return false;
    }
}