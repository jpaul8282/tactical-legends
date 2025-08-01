using UnityEngine;
using UnityEngine.AI;

public class EnemyAI : MonoBehaviour
{
    public int Health = 50;
    public NavMeshAgent Agent;
    public Transform Target;
    public Weapon Weapon;
    public float DetectionRadius = 15f;

    void Update()
    {
        if (Vector3.Distance(transform.position, Target.position) < DetectionRadius)
        {
            Agent.SetDestination(Target.position);
            Attack();
        }
    }

    void Attack()
    {
        // Add shooting logic here
    }

    public void TakeDamage(int amount)
    {
        Health -= amount;
        if (Health <= 0)
            Die();
    }

    void Die()
    {
        Destroy(gameObject);
    }
}