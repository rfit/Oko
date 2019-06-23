import * as React from 'react';

// import Button from '@material-ui/core/Button';
// import CssBaseline from '@material-ui/core/CssBaseline';
// import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
// import LockIcon from '@material-ui/icons/LockOutlined';

const styles: any = (theme: any) => ({
});

function Help(props: any) {
	// const { classes } = props;

	return (
		<main>
			<Typography component="h1" variant="h2" gutterBottom>
				Anvendelse af RF’s 90% anprisningsmærke
			</Typography>
			<Typography paragraph>
				Alle boder på årets festival skal opfylde kravet om 90% økologi – og boderne skal
				derudover benytte festivalens anprisningsmærke, så det hænger synligt for bodens
				kunder.
			</Typography>
			<Typography paragraph>

				Det er op til den enkelte bod at sørge for at opdatere dokumentationen for, at kravene
				til anprisningsmærket overholdes. Herefter bliver dokumentationen kontrolleret af
				Fødevarestyrelsen i forbindelse med den ”almindelige” kontrol.

				<br />
				<br />

				I år skal denne dokumentation foretages via vores nye web-app. App’en kan benyttes
				både via computer og mobile devices. Dokumentationen skal på alle tider være
				tilgængelige for kontrolenheden fra Fødevarestyrelsen (FVST). Derudover kan
				RFadmin følge med i bodernes indtastninger, og på den måde være løbende opdateret
				om festivalens aktuelle økologiprocent.


				<br />
				<br />

				Hver bod bør have en økologiansvarlig, som har ansvaret for, at økologiregnskabet
				opdateres løbende. Den økologiansvarlige kan via ap’en tilføje brugere, som også kan
				indtaste oplysninger ved levering, og som derfor vil have økologiregnskabet liggende
				tilgængeligt for FVST.


				<br />
				<br />

				For at beregne økologiprocenten, skal der indtastes 3 tal pr. levering:
				<ul>
					<li>
						Det samlede antal kr. eller kg
					</li>
					<li>
						Den ikke omfattede andel ex. salt, vand, vildtfanges fisk etc.
					</li>
					<li>
						Den samlede økologiske andel i kr. eller kg.
					</li>
				</ul>

				<br />

				Ved levering fra de fleste leverandører vil disse tal fremgå af følgesedlen eller
				fakturaen og kan nemt skrives ind i app’en. Hos andre leverandører skal du finde dine
				økooplysninger i webshoppen.


				<br />
				<br />

				Hvis der ikke fremgår økooplysninger på følgesedlen, og du ikke kan finde dine
				økooplysninger i webshoppen, skal du selv finde frem til de tre nøgletal. Hvis I
				beregner efter vægt, er det det vigtigt, at du husker, at veje varen og notere vægten på
				følgesedlerne, hvis det ikke allerede er anført.

				<br />
				<br />

				<strong>Regnskabet regnes ud over hele festivalperioden, og økologiprocenten må på
				intet tidspunkt komme under de 90 %, da dette vil kræve, at man fjerner
				anprisningsmærket fra bodens facade.</strong>

				<br />
				<br />

				Hver enkelt linje i økoregnskabet svarer til én levering / én følgeseddel. Og det er
				vigtigt, at de enkelte følgesedler/fakturaer findes som dokumentation for regnskabet.
				Da jeres øko-ansvarlige jo formentligt ikke kan være på pladsen alle døgnets 24 timer,
				er det vigtigt, at der i boden forefindes en mappe indeholdende den relevante
				information. Ligesom selve økoregnskabet skal være tilgængeligt via app’en, også
				selvom den økologiansvarlige ikke er at finde i boden. Følgesedlerne skal altid sættes i
				mappen umiddelbart efter levering.

				<br />
				<br />
			</Typography>
			<Typography component="h2" variant="h5" gutterBottom>
				Regnskabet skal opdateres hver dag.
			</Typography>
			<Typography paragraph>
				Leveringer som ankommer til boden mellem midnat og kl. 12.00 skal opdateres i
				regnskabet samme dag senest kl. 16.00.

				<br />
				<br />

				Leveringer som ankommer til boden mellem 12.00 og midnat skal opdateres i
				regnskabet den efterfølgende dag senest kl. 10.00.
				<br />
				<br />

				Bodens økologiprocent beregnes derved løbende over den periode som festivalen
				foregår i.

				<br />
				<br />
				Hvis bodens samlede økologi-procent på noget tidspunkt dykker under de 90%
				skal anprisningsmærket fjernes omgående, og må først sættes op igen, når den
				samlede økologiprocent igen når over de 90%.
				Har I spørgsmål eller har I brug for hjælp til dokumentationen, så kontakt jeres
				bodansvarlige eller undertegnede.

				<br />
				<br />

				De bedste hilsner<br />
				Stine Eisen, RF Økoansvarlig, 22 15 36 36, <a href="mailto:stine.eisen@roskilde-festival.dk">stine.eisen@roskilde-festival.dk</a>

			</Typography>
		</main>
	);
  }

export default withStyles(styles)(Help);
