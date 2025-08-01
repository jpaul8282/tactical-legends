using UnityEngine;
using UnityEngine.AI;

public enum EnemyState { Patrol, Search, Alert, Attack, InvestigateNoise, Flee }

public class EnemyAI : MonoBehaviour
{
    public int Health = 50;
    public NavMeshAgent Agent;
    public Transform Target;
    public Weapon Weapon;
    public float DetectionRadius = 15f;
    public EnemyState CurrentState = EnemyState.Patrol;
    public float StealthDetectionThreshold = 0.3f; // Lower is harder to detect

    void Update()
    {
        switch(CurrentState)
        {
            case EnemyState.Patrol:
                Patrol();
                break;
            case EnemyState.Search:
                Search();
                break;
            case EnemyState.Alert:
                Alert();
                break;
            case EnemyState.Attack:
                Attack();
                break;
            case EnemyState.InvestigateNoise:
                InvestigateNoise();
                break;
            case EnemyState.Flee:
                Flee();
                break;
        }

        // Stealth detection
        float distance = Vector3.Distance(transform.position, Target.position);
        if (distance < DetectionRadius && CanSeePlayer())
        {
            CurrentState = EnemyState.Attack;
        }
        else if (HeardNoise())
        {
            CurrentState = EnemyState.InvestigateNoise;
        }
    }

    void Patrol() { /* Waypoint or random navmesh patrol logic */ }
    void Search() { /* Move to last known player position */ }
    void Alert() { /* Call for reinforcements, raise alarm */ }
    void Attack() { /* Shooting logic, aim at player */ }
    void InvestigateNoise() { /* Move to noise source */ }
    void Flee() { /* Retreat on low health */ }

    public void TakeDamage(int amount)
    {
        Health -= amount;
        if (Health <= 0)
            Die();
        else
            CurrentState = EnemyState.Alert;
    }

    void Die()
    {
        Destroy(gameObject);
    }

    bool CanSeePlayer()
    {
        // Use raycast and player stealth factor
        RaycastHit hit;
        Vector3 dir = (Target.position - transform.position).normalized;
        if (Physics.Raycast(transform.position, dir, out hit, DetectionRadius))
        {
            var stealth = Target.GetComponent<PlayerStealth>();
            float playerStealth = stealth != null ? stealth.CurrentStealth : 1f;
            return hit.transform == Target && playerStealth < StealthDetectionThreshold;
        }
        return false;
    }

    bool HeardNoise()
    {
        // Implement logic for noise detection
        return false;
    }
}