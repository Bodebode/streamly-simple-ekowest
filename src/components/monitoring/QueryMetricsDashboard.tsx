import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";

interface QueryMetric {
  query_name: string;
  execution_time: number;
  rows_affected: number;
  category: string;
  created_at: string;
}

export const QueryMetricsDashboard = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["queryMetrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("query_metrics")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        console.error("Error fetching query metrics:", error);
        throw error;
      }

      return data as QueryMetric[];
    },
  });

  if (isLoading) {
    return <div>Loading metrics...</div>;
  }

  const formatMetricsForChart = (data: QueryMetric[]) => {
    return data?.map(metric => ({
      ...metric,
      time: format(new Date(metric.created_at), "HH:mm:ss"),
      executionTime: Number(metric.execution_time.toFixed(2))
    })) || [];
  };

  const getAverageExecutionTime = () => {
    if (!metrics?.length) return 0;
    const total = metrics.reduce((acc, curr) => acc + curr.execution_time, 0);
    return (total / metrics.length).toFixed(2);
  };

  const getQueryCategories = () => {
    if (!metrics?.length) return [];
    const categories = metrics.reduce((acc: { name: string; count: number }[], curr) => {
      const existing = acc.find(cat => cat.name === curr.category);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ name: curr.category || 'uncategorized', count: 1 });
      }
      return acc;
    }, []);
    return categories;
  };

  const chartData = formatMetricsForChart(metrics || []);
  const categories = getQueryCategories();

  return (
    <div className="space-y-8 p-8">
      <h2 className="text-3xl font-bold">Query Performance Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Queries</CardTitle>
            <CardDescription>Number of queries monitored</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{metrics?.length || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Execution Time</CardTitle>
            <CardDescription>In milliseconds</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{getAverageExecutionTime()}ms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unique Categories</CardTitle>
            <CardDescription>Number of query categories</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{categories.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Query Execution Times</CardTitle>
          <CardDescription>Last 100 queries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="executionTime"
                  stroke="#8884d8"
                  name="Execution Time (ms)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Queries by Category</CardTitle>
          <CardDescription>Distribution of queries across categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categories}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" name="Number of Queries" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};