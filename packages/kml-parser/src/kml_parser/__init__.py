"""KML → unified hole JSON parser."""
from kml_parser.parser import ParseError, parse_kml, parse_kml_file
from kml_parser.schema import Hole, Polygon, Tree

__all__ = ["parse_kml", "parse_kml_file", "ParseError", "Hole", "Polygon", "Tree"]
