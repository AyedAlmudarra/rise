import LogoIcon from '@/assets/images/logos/logo-icon.svg'
import { Link } from "react-router-dom";

const Logo = () => {
  return (
   <Link to={'/'}>
      <img src={LogoIcon} alt="logo" />
    </Link>
  )
}

export default Logo
