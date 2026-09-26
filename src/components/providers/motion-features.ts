/**
 * framer-motion's feature bundle, split into its own chunk.
 *
 * domMax rather than domAnimation because Reviews animates its card grid with
 * `layout` when the platform filter changes, and layout projection only ships
 * in domMax. It is loaded asynchronously (see MotionProvider), so its size is
 * off the critical path either way.
 */
import { domMax } from "framer-motion";

export default domMax;
