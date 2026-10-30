"use client";

import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

type DeleteDestinationProps = {
  id: string;
};

const DeleteDestination = ({ id }: DeleteDestinationProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError("");

      const jwtToken = await getTokenFromClient();

      const res = await fetch(
        `http://localhost:8000/Destinations/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
          cache: "no-store",
        }
      );

      const result = await res.json().catch(() => ({}));

      if (res.status === 401) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      if (res.status === 403) {
        throw new Error("You are not allowed to delete this destination.");
      }

      if (!res.ok) {
        throw new Error(result.message || "Failed to delete destination.");
      }

      if (result.deletedCount !== 1) {
        throw new Error("Destination was not deleted. Please try again.");
      }

      // Database deletion confirmed. Reload Home with fresh data.
      window.location.replace("/Destinations");
    } catch (err) {
      console.error("Delete destination error:", err);

      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            variant="outline"
            className="w-full bg-red-500 text-white hover:bg-red-600"
          />
        }
      >
        Delete Destination
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete this destination? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950">
            {error}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              void handleDelete();
            }}
            disabled={loading}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDestination;