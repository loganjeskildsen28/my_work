// All 48 nations of the 2026 World Cup, with flags from the flag-icons set.
import us from 'flag-icons/flags/4x3/us.svg'
import mx from 'flag-icons/flags/4x3/mx.svg'
import ca from 'flag-icons/flags/4x3/ca.svg'
import gbEng from 'flag-icons/flags/4x3/gb-eng.svg'
import fr from 'flag-icons/flags/4x3/fr.svg'
import hr from 'flag-icons/flags/4x3/hr.svg'
import no from 'flag-icons/flags/4x3/no.svg'
import pt from 'flag-icons/flags/4x3/pt.svg'
import de from 'flag-icons/flags/4x3/de.svg'
import nl from 'flag-icons/flags/4x3/nl.svg'
import ch from 'flag-icons/flags/4x3/ch.svg'
import gbSct from 'flag-icons/flags/4x3/gb-sct.svg'
import es from 'flag-icons/flags/4x3/es.svg'
import at from 'flag-icons/flags/4x3/at.svg'
import be from 'flag-icons/flags/4x3/be.svg'
import ba from 'flag-icons/flags/4x3/ba.svg'
import se from 'flag-icons/flags/4x3/se.svg'
import tr from 'flag-icons/flags/4x3/tr.svg'
import cz from 'flag-icons/flags/4x3/cz.svg'
import jp from 'flag-icons/flags/4x3/jp.svg'
import ir from 'flag-icons/flags/4x3/ir.svg'
import uz from 'flag-icons/flags/4x3/uz.svg'
import kr from 'flag-icons/flags/4x3/kr.svg'
import jo from 'flag-icons/flags/4x3/jo.svg'
import au from 'flag-icons/flags/4x3/au.svg'
import qa from 'flag-icons/flags/4x3/qa.svg'
import sa from 'flag-icons/flags/4x3/sa.svg'
import iq from 'flag-icons/flags/4x3/iq.svg'
import ma from 'flag-icons/flags/4x3/ma.svg'
import tn from 'flag-icons/flags/4x3/tn.svg'
import eg from 'flag-icons/flags/4x3/eg.svg'
import dz from 'flag-icons/flags/4x3/dz.svg'
import gh from 'flag-icons/flags/4x3/gh.svg'
import cv from 'flag-icons/flags/4x3/cv.svg'
import za from 'flag-icons/flags/4x3/za.svg'
import ci from 'flag-icons/flags/4x3/ci.svg'
import sn from 'flag-icons/flags/4x3/sn.svg'
import cd from 'flag-icons/flags/4x3/cd.svg'
import ar from 'flag-icons/flags/4x3/ar.svg'
import br from 'flag-icons/flags/4x3/br.svg'
import ec from 'flag-icons/flags/4x3/ec.svg'
import uy from 'flag-icons/flags/4x3/uy.svg'
import co from 'flag-icons/flags/4x3/co.svg'
import py from 'flag-icons/flags/4x3/py.svg'
import nz from 'flag-icons/flags/4x3/nz.svg'
import pa from 'flag-icons/flags/4x3/pa.svg'
import cw from 'flag-icons/flags/4x3/cw.svg'
import ht from 'flag-icons/flags/4x3/ht.svg'

const T = (code, name, flag, opponent = false) => ({ code, name, flag, opponent })

// The five USMNT opponents from the paper — rendered larger wherever they appear.
export const OPPONENTS = [
  T('au', 'Australia', au, true),
  T('be', 'Belgium', be, true),
  T('ba', 'Bosnia & Herzegovina', ba, true),
  T('py', 'Paraguay', py, true),
  T('tr', 'Türkiye', tr, true),
]

// Spine order: all 48 teams, with the five opponents spaced evenly through the cycle.
export const TEAMS = [
  T('au', 'Australia', au, true),
  T('us', 'United States', us),
  T('mx', 'Mexico', mx),
  T('ca', 'Canada', ca),
  T('gb-eng', 'England', gbEng),
  T('fr', 'France', fr),
  T('hr', 'Croatia', hr),
  T('no', 'Norway', no),
  T('pt', 'Portugal', pt),
  T('be', 'Belgium', be, true),
  T('de', 'Germany', de),
  T('nl', 'Netherlands', nl),
  T('ch', 'Switzerland', ch),
  T('gb-sct', 'Scotland', gbSct),
  T('es', 'Spain', es),
  T('at', 'Austria', at),
  T('se', 'Sweden', se),
  T('cz', 'Czechia', cz),
  T('jp', 'Japan', jp),
  T('ba', 'Bosnia & Herzegovina', ba, true),
  T('ir', 'Iran', ir),
  T('uz', 'Uzbekistan', uz),
  T('kr', 'South Korea', kr),
  T('jo', 'Jordan', jo),
  T('qa', 'Qatar', qa),
  T('sa', 'Saudi Arabia', sa),
  T('iq', 'Iraq', iq),
  T('ma', 'Morocco', ma),
  T('tn', 'Tunisia', tn),
  T('py', 'Paraguay', py, true),
  T('eg', 'Egypt', eg),
  T('dz', 'Algeria', dz),
  T('gh', 'Ghana', gh),
  T('cv', 'Cape Verde', cv),
  T('za', 'South Africa', za),
  T('ci', 'Ivory Coast', ci),
  T('sn', 'Senegal', sn),
  T('cd', 'DR Congo', cd),
  T('ar', 'Argentina', ar),
  T('tr', 'Türkiye', tr, true),
  T('br', 'Brazil', br),
  T('ec', 'Ecuador', ec),
  T('uy', 'Uruguay', uy),
  T('co', 'Colombia', co),
  T('nz', 'New Zealand', nz),
  T('pa', 'Panama', pa),
  T('cw', 'Curaçao', cw),
  T('ht', 'Haiti', ht),
]

export function TeamFlag({ team, width = 36, decorative = false }) {
  return (
    <img
      src={team.flag}
      alt={decorative ? '' : `Flag of ${team.name}`}
      width={width}
      height={width * 0.75}
      loading="lazy"
      style={{ display: 'block', borderRadius: 3, objectFit: 'cover' }}
    />
  )
}
