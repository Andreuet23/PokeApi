import { useEffect, useState, useRef } from "react";
import {
  getPokemon,
  getPokemonCount,
  getPokemonDescription,
} from "../services/pokeapi";
import type { Pokemon } from "../types";
import { TYPE_ICONS } from "../constants/typeIcons";
import LoadingOverlay from "./LoadingOverlay";

function Pokedex() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [id, setId] = useState<number>(1); // Bulbasaur por defecto
  const [maxId, setMaxId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");

  const [showOverlay, setShowOverlay] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shiny, setShiny] = useState(false);

  const overlayTimer = useRef<number | null>(null);
  const progressTimer = useRef<number | null>(null);
  const OVERLAY_MIN_SHOW = 500;
  const overlayShonAt = useRef<number>(0);

  useEffect(() => {
    getPokemonCount()
      .then(setMaxId)
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    let canceled = false;
    setError(null);
    setPokemon(null);
    setDescription("");
    overlayShonAt.current = Date.now();
    setShowOverlay(true);
    setProgress(0);

    if (progressTimer.current) {
      clearInterval(progressTimer.current);
      progressTimer.current = null;
    }

    // Simular progreso
    progressTimer.current = window.setInterval(() => {
      setProgress((p) => (p < 90 ? p + 2 : 90));
    }, 50);

    (async () => {
      try {
        const data = await getPokemon(id);
        const desc = await getPokemonDescription(id, "en");
        setPokemon(data);
        setDescription(desc);
        if (canceled) return;

        const imgUrl = data.sprites.other.home.front_default;

        if (imgUrl) {
          await new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = imgUrl;
          });
        }

        if (canceled) return;

        setProgress(100);

        const elapsed = Date.now() - overlayShonAt.current;
        const remaining = Math.max(0, OVERLAY_MIN_SHOW - elapsed);

        overlayTimer.current = window.setTimeout(() => {
          if (!canceled) {
            setPokemon(data);
            setShowOverlay(false);
          }
        }, remaining);
      } catch (e) {
        if (!canceled) {
          setError(e instanceof Error ? e.message : "Error desconocido");
          setShowOverlay(false);
        }
      } finally {
        if (!canceled && progressTimer.current) {
          clearInterval(progressTimer.current);
          progressTimer.current = null;
        }
      }
    })();

    return () => {
      canceled = true;
      if (overlayTimer.current) {
        clearTimeout(overlayTimer.current);
        overlayTimer.current = null;
      }
      if (progressTimer.current) {
        clearInterval(progressTimer.current);
        progressTimer.current = null;
      }
    };
  }, [id]);

  const prev = () => setId((n) => Math.max(1, n - 1));
  const next = () =>
    setId((n) => (maxId == null ? n + 1 : Math.min(maxId, n + 1)));

  const atStart = id === 1;
  const atEnd = maxId != null && id === maxId;

  return (
    <div id="pokedex">
      <div id="left">
        <div id="logo"></div>
        <div id="bg_curve1_left"></div>
        <div id="bg_curve2_left"></div>
        <div id="curve1_left">
          <div id="buttonGlass">
            <div id="reflect"> </div>
          </div>
          <div id="miniButtonGlass1"></div>
          <div id="miniButtonGlass2"></div>
          <div id="miniButtonGlass3"></div>
        </div>
        <div id="curve2_left">
          <div id="junction">
            <div id="junction1"></div>
            <div id="junction2"></div>
          </div>
        </div>
        <div id="screen">
          <div id="topPicture">
            <div id="buttontopPicture1"></div>
            <div id="buttontopPicture2"></div>
          </div>
          <div
            id="picture"
            style={{ position: "relative", overflow: "hidden" }}
          >
            <LoadingOverlay show={showOverlay} progress={progress} />

            {!showOverlay && error && <p style={{ color: "red" }}>{error}</p>}

            <img
              src={
                shiny
                  ? pokemon?.sprites.other.home.front_shiny
                  : pokemon?.sprites.other.home.front_default
              }
              alt={pokemon?.name}
            />
          </div>
          <div id="buttonbottomPicture"></div>
          <div id="speakers">
            <div className="sp"></div>
            <div className="sp"></div>
            <div className="sp"></div>
          </div>
        </div>
        <div id="bigbluebutton" onClick={() => setShiny(!shiny)}></div>
        <div id="barbutton1"></div>
        <div id="barbutton2"></div>
        <div id="cross">
          <div id="leftcross">
            <div id="leftT" onClick={!atStart ? prev : undefined}></div>
          </div>
          <div id="topcross">
            <div id="upT"></div>
          </div>
          <div id="rightcross">
            <div id="rightT" onClick={!atEnd ? next : undefined}></div>
          </div>
          <div id="midcross">
            <div id="midCircle"></div>
          </div>
          <div id="botcross">
            <div id="downT"></div>
          </div>
        </div>
      </div>
      <div id="right">
        <div id="stats">
          <center>
            <h2 style={{ margin: 0, padding: 0 }}>
              {pokemon?.name.toUpperCase()}
            </h2>
          </center>
          {pokemon?.types.map((t) =>
            t?.type?.name ? (
              <img
                key={t.slot}
                src={TYPE_ICONS[t.type.name]}
                alt={t.type.name}
                style={{ width: 80, marginRight: 4 }}
              />
            ) : null
          )}
          <br />
          <strong>{description}</strong>
        </div>
        <div id="blueButtons1">
          <div className="blueButton"></div>
          <div className="blueButton"></div>
          <div className="blueButton"></div>
          <div className="blueButton"></div>
          <div className="blueButton"></div>
        </div>
        <div id="blueButtons2">
          <div className="blueButton"></div>
          <div className="blueButton"></div>
          <div className="blueButton"></div>
          <div className="blueButton"></div>
          <div className="blueButton"></div>
        </div>
        <div id="miniButtonGlass4"></div>
        <div id="miniButtonGlass5"></div>
        <div id="barbutton3"></div>
        <div id="barbutton4"></div>
        <div id="yellowBox1"></div>
        <div id="yellowBox2"></div>
        <div id="bg_curve1_right"></div>
        <div id="bg_curve2_right"></div>
        <div id="curve1_right"></div>
        <div id="curve2_right"></div>
      </div>
    </div>
  );
}

export default Pokedex;
