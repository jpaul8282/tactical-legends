<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tactical Legends Loading</title>
    <style>
        * {
            border: 0;
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        :root {
            --hue: 223;
            --sat: 10%;
            --bg: hsl(var(--hue), var(--sat), 90%);
            --fg: hsl(var(--hue), var(--sat), 10%);
            --hue-success: 126;
            --success1: hsl(var(--hue-success), 90%, 40%);
            --success2: hsl(var(--hue-success), 90%, 24%);
            --periwinkle: hsl(240, 90%, 70%);
            --light-blue: hsl(210, 90%, 70%);
            --orange: hsl(15, 90%, 70%);
            --magenta: hsl(300, 90%, 70%);
            --light-green: hsl(105, 40%, 70%);
            --light-teal: hsl(150, 40%, 70%);
            --purple: hsl(270, 90%, 70%);
            --trans-dur: 0.3s;
            font-size: clamp(1rem, 0.95rem + 0.25vw, 1.25rem);
        }

        body {
            background-color: var(--bg);
            color: var(--fg);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font: 1em/1.5 sans-serif;
            height: 100vh;
            transition: background-color var(--trans-dur), color var(--trans-dur);
        }

        .spinner-container {
            position: relative;
            width: 8em;
            height: 8em;
        }

        .spinner {
            overflow: visible;
            width: 100%;
            height: 100%;
            transition: color var(--trans-dur);
            visibility: hidden;
            opacity: 0;
        }

        .spinner-container.loading .spinner {
            color: var(--fg);
            visibility: visible;
            opacity: 1;
        }

        .spinner-container.success .spinner {
            color: var(--success2);
            visibility: visible;
            opacity: 1;
        }

        .spinner__worm {
            animation: worm 4s linear forwards;
        }

        .spinner__check,
        .spinner__pop-start,
        .spinner__worm {
            transform-origin: 24px 24px;
        }

        .spinner__check {
            animation: check 4s linear forwards;
        }

        .spinner__pop-dot {
            animation: pop-dot 4s linear forwards;
        }

        .spinner__pop-dot-group {
            animation: pop-dot-group1 4s linear forwards;
        }

        .spinner__pop-dot-group + .spinner__pop-dot-group {
            animation: pop-dot-group2 4s linear forwards;
        }

        .spinner__pop-end {
            animation: pop-end 4s linear forwards;
        }

        .spinner__pop-start {
            animation: pop-start 4s linear forwards;
        }

        .button-container {
            margin-top: 2rem;
            display: flex;
            gap: 1rem;
        }

        .control-button {
            background-color: var(--fg);
            color: var(--bg);
            padding: 0.75rem 1.5rem;
            border-radius: 9999px;
            cursor: pointer;
            transition: all var(--trans-dur);
        }
        
        .control-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }

        .control-button.primary {
            background-color: var(--success1);
        }

        @keyframes check {
            from, 64% {
                stroke-dashoffset: -36.7;
                transform: scale(1);
            }
            75%, 77% {
                animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
                stroke-dashoffset: 13.7;
                transform: scale(1);
            }
            79% {
                animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
                stroke-dashoffset: 13.7;
                transform: scale(0.4);
            }
            87% {
                animation-timing-function: cubic-bezier(0.32, 0, 0.67, 0);
                stroke-dashoffset: 13.7;
                transform: scale(1.4);
            }
            93%, to {
                stroke-dashoffset: 13.7;
                transform: scale(1);
            }
        }

        @keyframes pop-dot {
            from, 80% {
                animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
                transform: translate(0, 6px);
            }
            90%, to {
                transform: translate(0, 0);
            }
        }

        @keyframes pop-dot-group1 {
            from, 82.5%, 90%, to {
                opacity: 0;
            }
            85%, 87.5% {
                opacity: 1;
            }
        }

        @keyframes pop-dot-group2 {
            from, 82.5%, to {
                opacity: 0;
            }
            85%, 90% {
                opacity: 1;
            }
        }

        @keyframes pop-end {
            from {
                animation-timing-function: steps(1, end);
                opacity: 0;
                r: 18px;
                stroke-width: 4px;
            }
            82.5% {
                animation-timing-function: linear;
                opacity: 1;
                r: 18px;
                stroke-width: 4px;
            }
            84%, to {
                opacity: 0;
                r: 19px;
                stroke-width: 3px;
            }
        }

        @keyframes pop-start {
            from {
                animation-timing-function: steps(1, end);
                opacity: 0;
                transform: scale(0.35);
            }
            76% {
                animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
                opacity: 1;
                transform: scale(0.35);
            }
            82.5% {
                animation-timing-function: steps(1, start);
                opacity: 1;
                transform: scale(1);
            }
            to {
                opacity: 0;
                transform: scale(1);
            }
        }

        @keyframes worm {
            from {
                stroke-dashoffset: -51.84;
                transform: rotate(-119deg);
            }
            60% {
                stroke-dashoffset: -51.84;
                transform: rotate(961deg);
            }
            64% {
                animation-timing-function: cubic-bezier(0.61, 1, 0.88, 1);
                stroke-dashoffset: -51.84;
                transform: rotate(1033deg);
            }
            72.5%, to {
                stroke-dashoffset: -138.23;
                transform: rotate(1033deg);
            }
        }
    </style>
</head>
<body>
    <div id="spinner-container" class="spinner-container">
        <svg class="spinner" viewBox="0 0 48 48" role="img" aria-label="A partial ring that rotates and then is shaped as a checkmark, which pops out yielding confetti">
            <g fill="none" stroke="currentcolor" stroke-linecap="round" stroke-width="4">
                <circle class="spinner__worm" cx="24" cy="24" r="22" stroke-dasharray="138.23 138.23" stroke-dashoffset="-51.84" transform="rotate(-119)" />
                <circle class="spinner__pop-end" stroke="var(--light-green)" cx="24" cy="24" r="18" opacity="0" />
                <g fill="currentcolor" stroke="none">
                    <circle class="spinner__pop-start" fill="var(--light-green)" cx="24" cy="24" r="20" opacity="0" />
                    <g>
                        <g class="spinner__pop-dot-group" opacity="0">
                            <circle class="spinner__pop-dot" fill="var(--periwinkle)" cx="22" cy="5" r="1.5" />
                        </g>
                        <g class="spinner__pop-dot-group" opacity="0">
                            <circle class="spinner__pop-dot" fill="var(--light-blue)" cx="26" cy="2" r="1.5" />
                        </g>
                    </g>
                    <g transform="rotate(51.43,24,24)">
                        <g class="spinner__pop-dot-group" opacity="0">
                            <circle class="spinner__pop-dot" fill="var(--orange)" cx="22" cy="5" r="1.5" />
                        </g>
                        <g class="spinner__pop-dot-group" opacity="0">
                            <circle class="spinner__pop-dot" fill="var(--magenta)" cx="26" cy="2" r="1.5" />
                        </g>
                    </g>
                    <g transform="rotate(102.86,24,24)">
                        <g class="spinner__pop-dot-group" opacity="0">
                            <circle class="spinner__pop-dot" fill="var(--light-green)" cx="22" cy="5" r="1.5" />
                        </g>
                        <g class="spinner__pop-dot-group" opacity="0">
                            <circle class="spinner__pop-dot" fill="var(--light-teal)" cx="26" cy="2" r="1.5" />
                        </g>
                    </g>
                    <g transform="rotate(154.29,24,24)">
                        <g class="spinner__pop-dot-group" opacity="0">
                            <circle class="spinner__pop-dot" fill="var(--purple)" cx="22" cy="5" r="1.5" />
                        </g>
                        <g class="spinner__pop-dot-group" opacity="0">
                            <circle class="spinner__pop-dot" fill="var(--magenta)" cx="26" cy="2" r="1.5" />
                        </g>
                    </g>
                    <g transform="rotate(205.71,24,24)">
                        <g class="spinner__pop-dot-group" opacity="0">
                            <circle class="spinner__pop-dot" fill="var(--light-teal)" cx="22" cy="5" r="1.5" />
                        </g>
                        <g class="spinner__pop-dot-group" opacity="0">
                            <circle class="spinner__pop-dot" fill="var(--light-blue)" cx="26" cy="2" r="1.5" />
                        </g>
                    </g>
                    <g transform="rotate(257.14,24,24)">
                        <g class="spinner__pop-dot-group" opacity="0">
                            <circle class="spinner__pop-dot" fill="var(--periwinkle)" cx="22" cy="5" r="1.5" />
                        </g>
                        <g class="spinner__pop-dot-group" opacity="0">
                            <circle class="spinner__pop-dot" fill="var(--light-blue)" cx="26" cy="2" r="1.5" />
                        </g>
                    </g>
                    <g transform="rotate(308.57,24,24)">
                        <g class="spinner__pop-dot-group" opacity="0">
                            <circle class="spinner__pop-dot" fill="var(--purple)" cx="22" cy="5" r="1.5" />
                        </g>
                        <g class="spinner__pop-dot-group" opacity="0">
                            <circle class="spinner__pop-dot" fill="var(--light-teal)" cx="26" cy="2" r="1.5" />
                        </g>
                    </g>
                </g>
                <path class="spinner__check" d="M 17 25 L 22 30 C 22 30 32.2 19.8 37.3 14.7 C 41.8 10.2 39 7.9 39 7.9" stroke-dasharray="36.7 36.7" stroke-dashoffset="-36.7" />
            </g>
        </svg>
    </div>
    <div class="button-container">
        <button id="start-button" class="control-button">Start Loading</button>
        <button id="success-button" class="control-button primary">Success</button>
    </div>

    <script>
        const spinnerContainer = document.getElementById('spinner-container');
        const startButton = document.getElementById('start-button');
        const successButton = document.getElementById('success-button');

        startButton.addEventListener('click', () => {
            spinnerContainer.classList.add('loading');
            spinnerContainer.classList.remove('success');
        });

        successButton.addEventListener('click', () => {
            spinnerContainer.classList.remove('loading');
            spinnerContainer.classList.add('success');
        });
    </script>
</body>
</html>



<svg class="spinner" viewBox="0 0 48 48" role="img" aria-label="A partial ring that rotates and then is shaped as a checkmark, which pops out yielding confetti">
	<g fill="none" stroke="currentcolor" stroke-linecap="round" stroke-width="4">
		<circle class="spinner__worm" cx="24" cy="24" r="22" stroke-dasharray="138.23 138.23" stroke-dashoffset="-51.84" transform="rotate(-119)" />
		<circle class="spinner__pop-end" stroke="var(--light-green)" cx="24" cy="24" r="18" opacity="0" />
		<g fill="currentcolor" stroke="none">
			<circle class="spinner__pop-start" fill="var(--light-green)" cx="24" cy="24" r="20" opacity="0" />
			<g>
				<g class="spinner__pop-dot-group" opacity="0">
					<circle class="spinner__pop-dot" fill="var(--periwinkle)" cx="22" cy="5" r="1.5" />
				</g>
				<g class="spinner__pop-dot-group" opacity="0">
					<circle class="spinner__pop-dot" fill="var(--light-blue)" cx="26" cy="2" r="1.5" />
				</g>
			</g>
			<g transform="rotate(51.43,24,24)">
				<g class="spinner__pop-dot-group" opacity="0">
					<circle class="spinner__pop-dot" fill="var(--orange)" cx="22" cy="5" r="1.5" />
				</g>
				<g class="spinner__pop-dot-group" opacity="0">
					<circle class="spinner__pop-dot" fill="var(--magenta)" cx="26" cy="2" r="1.5" />
				</g>
			</g>
			<g transform="rotate(102.86,24,24)">
				<g class="spinner__pop-dot-group" opacity="0">
					<circle class="spinner__pop-dot" fill="var(--light-green)" cx="22" cy="5" r="1.5"  />
				</g>
				<g class="spinner__pop-dot-group" opacity="0">
					<circle class="spinner__pop-dot" fill="var(--light-teal)" cx="26" cy="2" r="1.5" />
				</g>
			</g>
			<g transform="rotate(154.29,24,24)">
				<g class="spinner__pop-dot-group" opacity="0">
					<circle class="spinner__pop-dot" fill="var(--purple)" cx="22" cy="5" r="1.5" />
				</g>
				<g class="spinner__pop-dot-group" opacity="0">
					<circle class="spinner__pop-dot" fill="var(--magenta)" cx="26" cy="2" r="1.5" />
				</g>
			</g>
			<g transform="rotate(205.71,24,24)">
				<g class="spinner__pop-dot-group" opacity="0">
					<circle class="spinner__pop-dot" fill="var(--light-teal)" cx="22" cy="5" r="1.5" />
				</g>
				<g class="spinner__pop-dot-group" opacity="0">
					<circle class="spinner__pop-dot" fill="var(--light-blue)" cx="26" cy="2" r="1.5" />
				</g>
			</g>
			<g transform="rotate(257.14,24,24)">
				<g class="spinner__pop-dot-group" opacity="0">
					<circle class="spinner__pop-dot" fill="var(--periwinkle)" cx="22" cy="5" r="1.5" />
				</g>
				<g class="spinner__pop-dot-group" opacity="0">
					<circle class="spinner__pop-dot" fill="var(--light-blue)" cx="26" cy="2" r="1.5" />
				</g>
			</g>
			<g transform="rotate(308.57,24,24)">
				<g class="spinner__pop-dot-group" opacity="0">
					<circle class="spinner__pop-dot" fill="var(--purple)" cx="22" cy="5" r="1.5" />
				</g>
				<g class="spinner__pop-dot-group" opacity="0">
					<circle class="spinner__pop-dot" fill="var(--light-teal)" cx="26" cy="2" r="1.5" />
				</g>
			</g>
		</g>
		<path class="spinner__check" d="M 17 25 L 22 30 C 22 30 32.2 19.8 37.3 14.7 C 41.8 10.2 39 7.9 39 7.9" stroke-dasharray="36.7 36.7" stroke-dashoffset="-36.7" />
	</g>
</svg>
* {
	border: 0;
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}
:root {
	// theme
	--hue: 223;
	--sat: 10%;
	--bg: hsl(var(--hue),var(--sat),90%);
	--fg: hsl(var(--hue),var(--sat),10%);
	// checkmark
	--hue-success: 126;
	--success1: hsl(var(--hue-success),90%,40%);
	--success2: hsl(var(--hue-success),90%,24%);
	// dots
	--periwinkle: hsl(240,90%,70%);
	--light-blue: hsl(210,90%,70%);
	--orange: hsl(15,90%,70%);
	--magenta: hsl(300,90%,70%);
	--light-green: hsl(105,40%,70%);
	--light-teal: hsl(150,40%,70%);
	--purple: hsl(270,90%,70%);
	// other
	--trans-dur: 0.3s;
	font-size: clamp(1rem,0.95rem + 0.25vw,1.25rem);
}
body {
	background-color: var(--bg);
	color: var(--fg);
	display: flex;
	font: 1em/1.5 sans-serif;
	height: 100vh;
	transition:
		background-color var(--trans-dur),
		color var(--trans-dur);
}
.spinner {
	color: var(--success2);
	overflow: visible;
	margin: auto;
	width: 8em;
	height: auto;
	transition: color var(--trans-dur);

	circle,
	g,
	path {
		animation: {
			duration: 4s;
			timing-function: linear;
			fill-mode: forwards;
		};
	}
	&__check,
	&__pop-start,
	&__worm {
		transform-origin: 24px 24px;
	}
	&__check {
		animation-name: check;
	}
	&__pop {
		&-dot {
			animation-name: pop-dot;

			&-group {
				animation-name: pop-dot-group1;

				& + & {
					animation-name: pop-dot-group2;
				}
			}
		}
		&-end {
			animation-name: pop-end;
		}
		&-start {
			animation-name: pop-start;
		}
	}
	&__worm {
		animation-name: worm;
	}
}

/* Dark theme */
@media (prefers-color-scheme: dark) {
	:root {
		--bg: hsl(var(--hue),var(--sat),10%);
		--fg: hsl(var(--hue),var(--sat),90%);
	}
	.spinner {
		color: var(--success1);
	}
}

/* Animations */
$ease-out-sine: cubic-bezier(0.61,1,0.88,1);
$ease-in-cubic: cubic-bezier(0.32,0,0.67,0);
$ease-out-cubic: cubic-bezier(0.33,1,0.68,1);
$ease-in-out-cubic: cubic-bezier(0.65,0,0.35,1);

@keyframes check {
	from,
	64% {
		stroke-dashoffset: -36.7;
		transform: scale(1);
	}
	75%,
	77% {
		animation-timing-function: $ease-in-out-cubic;
		stroke-dashoffset: 13.7;
		transform: scale(1);
	}
	79% {
		animation-timing-function: $ease-in-out-cubic;
		stroke-dashoffset: 13.7;
		transform: scale(0.4);
	}
	87% {
		animation-timing-function: $ease-in-cubic;
		stroke-dashoffset: 13.7;
		transform: scale(1.4);
	}
	93%,
	to {
		stroke-dashoffset: 13.7;
		transform: scale(1);
	}
}
@keyframes pop-dot {
	from,
	80% {
		animation-timing-function: $ease-out-cubic;
		transform: translate(0,6px);
	}
	90%,
	to {
		transform: translate(0,0);
	}
}
@keyframes pop-dot-group1 {
	from,
	82.5%,
	90%,
	to {
		opacity: 0;
	}
	85%,
	87.5% {
		opacity: 1;
	}
}
@keyframes pop-dot-group2 {
	from,
	82.5%,
	to {
		opacity: 0;
	}
	85%,
	90% {
		opacity: 1;
	}
}
@keyframes pop-end {
	from {
		animation-timing-function: steps(1,end);
		opacity: 0;
		r: 18px;
		stroke-width: 4px;
	}
	82.5% {
		animation-timing-function: linear;
		opacity: 1;
		r: 18px;
		stroke-width: 4px;
	}
	84%,
	to {
		opacity: 0;
		r: 19px;
		stroke-width: 3px;
	}
}
@keyframes pop-start {
	from {
		animation-timing-function: steps(1,end);
		opacity: 0;
		transform: scale(0.35);
	}
	76% {
		animation-timing-function: $ease-in-out-cubic;
		opacity: 1;
		transform: scale(0.35);
	}
	82.5% {
		animation-timing-function: steps(1,start);
		opacity: 1;
		transform: scale(1);
	}
	to {
		opacity: 0;
		transform: scale(1);
	}
}
$startAngle: -119deg;
@keyframes worm {
	from {
		stroke-dashoffset: -51.84;
		transform: rotate($startAngle);
	}
	60% {
		stroke-dashoffset: -51.84;
		transform: rotate($startAngle + 3turn);
	}
	64% {
		animation-timing-function: $ease-out-sine;
		stroke-dashoffset: -51.84;
		transform: rotate($startAngle + 3.2turn);
	}
	72.5%,
	to {
		stroke-dashoffset: -138.23;
		transform: rotate($startAngle + 3.2turn);
	}
}
