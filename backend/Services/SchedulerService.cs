using Backend.DTOs;

namespace Backend.Services
{
    public class SchedulerService : ISchedulerService
    {
        public ScheduleResponseDTO GenerateOptimalSchedule(List<TaskScheduleDTO> tasks, DateTime projectStart)
        {
            // Build graph and in-degree
            var graph = new Dictionary<string, List<string>>();
            var inDegree = new Dictionary<string, int>();
            var taskMap = tasks.ToDictionary(t => t.Title);

            foreach (var task in tasks)
            {
                graph[task.Title] = new List<string>();
                inDegree[task.Title] = 0;
            }

            foreach (var task in tasks)
            {
                foreach (var dep in task.Dependencies)
                {
                    if (!graph.ContainsKey(dep))
                        throw new Exception($"Dependency '{dep}' does not exist.");

                    graph[dep].Add(task.Title);
                    inDegree[task.Title]++;
                }
            }

            // Topological sort using Kahn's algorithm
            var queue = new SortedSet<string>(inDegree.Where(kv => kv.Value == 0).Select(kv => kv.Key));
            var sorted = new List<string>();

            while (queue.Count > 0)
            {
                var current = queue.Min; // pick the earliest lexicographically to be consistent
                queue.Remove(current);
                sorted.Add(current);

                foreach (var neighbor in graph[current])
                {
                    inDegree[neighbor]--;
                    if (inDegree[neighbor] == 0)
                        queue.Add(neighbor);
                }
            }

            if (sorted.Count != tasks.Count)
                throw new Exception("Cyclic dependency detected among tasks.");

            // Schedule tasks considering estimated hours and due dates
            var schedule = new List<ScheduledTaskDTO>();
            var taskEndDates = new Dictionary<string, DateTime>();
            var currentTime = projectStart;

            foreach (var title in sorted)
            {
                var task = taskMap[title];

                // Ensure task starts after all dependencies are finished
                var earliestStart = task.Dependencies.Any()
                    ? task.Dependencies.Max(d => taskEndDates[d])
                    : currentTime;

                var endDate = earliestStart.AddHours(task.EstimatedHours);

                // Adjust end date if there is a due date
                if (task.DueDate.HasValue && endDate > task.DueDate.Value)
                {
                    endDate = task.DueDate.Value;
                    earliestStart = endDate.AddHours(-task.EstimatedHours); // move start back to fit
                }

                schedule.Add(new ScheduledTaskDTO
                {
                    Title = title,
                    StartDate = earliestStart,
                    EndDate = endDate
                });

                taskEndDates[title] = endDate;
            }

            return new ScheduleResponseDTO { ScheduledTasks = schedule };
        }
    }
}
