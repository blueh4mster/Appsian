using Backend.DTOs;
using System.Collections.Generic;

namespace Backend.Services
{
    public class SchedulerService
    {
        public List<TaskDTO> GenerateSchedule(List<TaskDTO> tasks)
        {
            // Build adjacency list (dependency graph)
            var graph = new Dictionary<string, List<string>>();
            var indegree = new Dictionary<string, int>();

            foreach (var task in tasks)
            {
                if (!graph.ContainsKey(task.Title))
                    graph[task.Title] = new List<string>();

                if (!indegree.ContainsKey(task.Title))
                    indegree[task.Title] = 0;
            }

            // Add edges
            foreach (var task in tasks)
            {
                foreach (var dep in task.Dependencies)
                {
                    if (!graph.ContainsKey(dep))
                        graph[dep] = new List<string>();

                    graph[dep].Add(task.Title);

                    if (!indegree.ContainsKey(task.Title))
                        indegree[task.Title] = 0;

                    indegree[task.Title]++;
                }
            }

            // Kahn’s algorithm (BFS-based topological sort)
            var queue = new Queue<string>(
                indegree.Where(kv => kv.Value == 0)
                        .Select(kv => kv.Key)
                        .OrderBy(title => tasks.First(t => t.Title == title).DueDate ?? DateTime.MaxValue)
            );

            var orderedTasks = new List<TaskDTO>();

            while (queue.Count > 0) {
                var currentTitle = queue.Dequeue();
                var currentTask = tasks.First(t => t.Title == currentTitle);
                orderedTasks.Add(currentTask);

                if (!graph.ContainsKey(currentTitle)) continue;

                foreach (var neighbor in graph[currentTitle])
                {
                    indegree[neighbor]--;
                    if (indegree[neighbor] == 0)
                        queue.Enqueue(neighbor);
                }
            }

            if (orderedTasks.Count != tasks.Count)
                throw new Exception("Cycle detected or invalid dependencies.");

            return orderedTasks;
        }
    }
}
