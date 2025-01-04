import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const TechStack = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Technology Stack Comparison</h1>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Component</TableHead>
              <TableHead>Ekowest TV</TableHead>
              <TableHead>Netflix</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Frontend</TableCell>
              <TableCell>React with TypeScript, Tailwind CSS, Shadcn UI</TableCell>
              <TableCell>JavaScript, React</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Mobile</TableCell>
              <TableCell>Not implemented (Web-only)</TableCell>
              <TableCell>Swift (iOS), Kotlin (Android)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Backend</TableCell>
              <TableCell>Supabase (PostgreSQL)</TableCell>
              <TableCell>Java, Spring Boot</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Data Science</TableCell>
              <TableCell>Not implemented</TableCell>
              <TableCell>Python</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Cloud Infrastructure</TableCell>
              <TableCell>Supabase (Built on AWS)</TableCell>
              <TableCell>AWS</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">API</TableCell>
              <TableCell>REST API (Supabase)</TableCell>
              <TableCell>GraphQL</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Real-time Analytics</TableCell>
              <TableCell>Supabase Real-time</TableCell>
              <TableCell>Druid</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Messaging and Streaming</TableCell>
              <TableCell>YouTube API Integration</TableCell>
              <TableCell>Apache Kafka, Apache Flink</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Development Tools</TableCell>
              <TableCell>Vite, TypeScript, npm</TableCell>
              <TableCell>Various internal tools</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        <p>Key differences:</p>
        <ul className="list-disc ml-6 mt-2 space-y-2">
          <li>Ekowest TV is a web-only platform, while Netflix has native mobile apps</li>
          <li>Ekowest TV uses Supabase as a backend-as-a-service, while Netflix has a custom Java backend</li>
          <li>Netflix has extensive data science and analytics capabilities</li>
          <li>Ekowest TV leverages YouTube for content delivery, while Netflix has its own content delivery infrastructure</li>
        </ul>
      </div>
    </div>
  );
};

export default TechStack;