import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CustomVideoPlayer } from "./CustomVideoPlayer";

describe("CustomVideoPlayer", () => {
  it("renders video element with given src and poster", () => {
    render(<CustomVideoPlayer src="/test.mp4" poster="/test.jpg" />);
    
    // El botón central de reproducción inicial debe estar visible
    const playButton = screen.getByRole("button", { name: /reproducir video/i });
    expect(playButton).toBeInTheDocument();

    // La barra de progreso debe estar disponible
    const progressInput = screen.getByLabelText(/progreso del video/i);
    expect(progressInput).toBeInTheDocument();
  });
});
